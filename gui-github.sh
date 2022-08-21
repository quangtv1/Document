# cicd
Tim hieu ve CI/CD

# Cac cau lenh git hay dung

Git global setup
git config --global user.name "Quang Tran Van"
git config --global user.email "quangtv@nuce.edu.vn"

Create a new repository
git clone git@gitlab.com:quangtv1/cicd.git
cd cicd
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master

Push an existing folder
cd existing_folder
git init
git remote add origin git@gitlab.com:quangtv1/cicd.git
git add .
git commit -m "Initial commit"
git push -u origin master

Push an existing Git repository
cd existing_repo
git remote rename origin old-origin
git remote add origin git@gitlab.com:quangtv1/cicd.git
git push -u origin --all
git push -u origin --tags




# Cai dat Docker
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum update -y && yum install docker-ce-18.06.2.ce -y
usermod -aG docker $(whoami)

## Create /etc/docker directory.
mkdir /etc/docker

# Setup daemon.
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF

mkdir -p /etc/systemd/system/docker.service.d


# Restart Docker
systemctl enable docker.service
systemctl daemon-reload
systemctl restart docker


# Tat SELinux
setenforce 0
sed -i --follow-symlinks 's/^SELINUX=enforcing/SELINUX=disabled/' /etc/sysconfig/selinux

# Tat Firewall
systemctl disable firewalld >/dev/null 2>&1
systemctl stop firewalld

# sysctl
cat >>/etc/sysctl.d/kubernetes.conf<<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system >/dev/null 2>&1

# Tat swap
sed -i '/swap/d' /etc/fstab
swapoff -a

# Add yum repo file for Kubernetes
cat >>/etc/yum.repos.d/kubernetes.repo<<EOF
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF

yum install -y -q kubeadm kubelet kubectl

systemctl enable kubelet
systemctl start kubelet

# Configure NetworkManager before attempting to use Calico networking.
cat >>/etc/NetworkManager/conf.d/calico.conf<<EOF
[keyfile]
unmanaged-devices=interface-name:cali*;interface-name:tunl*
EOF

cat >>/etc/hosts<<EOF
10.20.0.200     master.k8s
10.20.0.201     worker1.k8s
10.20.0.202     worker2.k8s
EOF
