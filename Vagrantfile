# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "hashicorp/precise64"

    config.vm.network :forwarded_port, guest: 9000, host: 9000
    config.vm.network :forwarded_port, guest: 35729, host: 35729
    config.vm.provision :shell, :path => "sh/provision.sh"

end
